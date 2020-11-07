var wpfmsq_first_name = null;
var wpfmsq_last_name = null;
var wpfmsq_amount_to_pay = null;
var wpfmsq_selected_currency = null;

const wpfmsqPaymentForm = new SqPaymentForm({
    applicationId: wpfmsq_sqpaymentform_variables.current_application_id,
    locationId: wpfmsq_sqpaymentform_variables.location_id,
    googlePay: {
        elementId: 'sq-google-pay'
    },
    inputClass: "sq-input",
    autoBuild: false,
    inputStyles: [
        {
            fontSize: "16px",
            lineHeight: "24px",
            padding: "16px",
            placeholderColor: "#a0a0a0",
            backgroundColor: "transparent",
        },
    ],
    cardNumber: {
        elementId: 'sq-card-number',
        placeholder: 'Card Number'
    },
    cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
    },
    expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
    },
    postalCode: {
        elementId: 'sq-postal-code',
        placeholder: 'Postal'
    },
    callbacks: {
        cardNonceResponseReceived: function (errors, nonce) {
            
            if (errors) {
                console.error("Encountered errors:");
                errors.forEach(function (error) {
                    console.error("  " + error.message);
                });
                alert(
                    "Encountered errors, check browser developer console for more details"
                );
                return;
            }

            var formData = {};
            jQuery('#wpfmsq_payment_form').find(':input').each(function(key, value){
                var label = jQuery('label[for="' + value.name + '"]').text();
                var value = value.value;
                if ("" !== label){    
                    formData[label] = value;
                }
                
            });

            formData = JSON.stringify(formData);

            const buyerVerificationDetails = {
                intent: "CHARGE",
                amount: wpfmsq_amount_to_pay,
                currencyCode: wpfmsq_selected_currency,
                billingContact: {
                    givenName: wpfmsq_first_name,
                    familyName: wpfmsq_last_name,
                },
            };

            wpfmsqPaymentForm.verifyBuyer(nonce, buyerVerificationDetails, function (
                err,
                verificationResult
            ) {
                if (err == null) {
                    let paymentRequestParams = {
                        action: "processPayment",
                        nonce: nonce,
                        amount: wpfmsq_amount_to_pay,
                        currency: wpfmsq_selected_currency,
                        formData: formData,
                        buyerVerification: verificationResult.token,
                    };

                    jQuery.post(
                        wpfmsq_sqpaymentform_variables.ajax_url,
                        paymentRequestParams,
                        function (response) {
                            response = JSON.parse(response);
                            if ('true' == response.error) {
                                jQuery('#wpfmsqFormAPIErrors').text(response.message);
                            }
                        }
                    );
                } else {
                    // console.log(err);
                }
            });


        },
        methodsSupported: function (methods, unsupportedReason) {
      
            console.log(methods);
      
            var googlePayBtn = document.getElementById('sq-google-pay');
      
            // Only show the button if Google Pay on the Web is enabled
            if (methods.googlePay === true) {
              googlePayBtn.style.display = 'inline-block';
            } else {
              console.log(unsupportedReason);
            }
    
        },
        createPaymentRequest: function () {
            var paymentRequestJson = {
              requestShippingAddress: true,
              requestBillingInfo: true,
              shippingContact: {
                familyName: "CUSTOMER LAST NAME",
                givenName: "CUSTOMER FIRST NAME",
                email: "mycustomer@example.com",
                country: "USA",
                region: "CA",
                city: "San Francisco",
                addressLines: [
                  "1455 Market St #600"
                ],
                postalCode: "94103",
                phone:"14255551212"
              },
              currencyCode: "USD",
              countryCode: "US",
              total: {
                label: "MERCHANT NAME",
                amount: "85.00",
                pending: false
              },
              lineItems: [
                {
                  label: "Subtotal",
                  amount: "60.00",
                  pending: false
                },
                {
                  label: "Shipping",
                  amount: "19.50",
                  pending: true
                },
                {
                  label: "Tax",
                  amount: "5.50",
                  pending: false
                }
              ],
              shippingOptions: [
                {
                  id: "1",
                  label: "SHIPPING LABEL",
                  amount: "SHIPPING COST"
                }
             ]
            };
      
            return paymentRequestJson;
          },  
      
    },
});


try {
    wpfmsqPaymentForm.build();
} catch (e) {
    console.log(e);
}

function wpfmsqOnGetCardNonce(event) {

    event.preventDefault();

    wpfmsq_amount_to_pay = jQuery('#wpfmsq_amount_to_pay').val();
    wpfmsq_selected_currency = jQuery('#wpfmsq_selected_currency').val();
    wpfmsq_first_name = jQuery('#wpfmsq_first_name').val();
    wpfmsq_last_name = jQuery('#wpfmsq_last_name').val();

    wpfmsqPaymentForm.requestCardNonce();
    
}
