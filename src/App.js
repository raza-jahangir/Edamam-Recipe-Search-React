import React, {useEffect, useState} from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Recipe from "./Recipe";
import './App.css';

function App() {

  const APP_ID = '49f2eafd';
  const APP_KEY = '90ecd4bbae74da5a06c14a793c942c4a';

  const [Recipes, setRecipes] = useState([]);
  const [Search, setSearch] = useState('');
  const [Query, setQuery] = useState('chicken');
  const [SpinnerState, setSpinnerState] = useState(<CircularProgress size={20} />);

  useEffect(() => {
    
    getRecipes();

  }, [Query]);


  const getRecipes = async () => {
    const response = await fetch(`https://api.edamam.com/search?q=${Query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=10&calories=591-722&health=alcohol-free`);
    const data = await response.json();
    setRecipes(data.hits);

    console.log(data.hits);
    setSpinnerState('');
  }


  const updateSearch = e => {
      setSearch(e.target.value)
  }

  const getSearch = e => {
    e.preventDefault();
    setQuery(Search);
  }


      return (

        <div className="App">
          
          <form onSubmit={getSearch} className="search-form">
          <a href="/"><h1> The Recipe Search</h1></a>
            <input className="search-bar" placeholder="Enter Search Term e.g. Chicken, Soup, Sandwich, Smoothie" type="text" onChange={updateSearch} value={Search} />
            <button className="search-button" type="submit"> Search </button>
          </form>

          <div className="recipes-grid">

            {SpinnerState}
            
            {Recipes.map(recipe => (
              <div key={recipe.recipe.label} className="single-recipe">

              <Recipe key={recipe.recipe.label}
                      title={recipe.recipe.label}
                      image={recipe.recipe.image}
                      ingredients={recipe.recipe.ingredients}
                      health={recipe.recipe.healthLabels}
                      url={recipe.recipe.url}
              />
              </div>
            ))}
          </div>
        </div>

      );

}

export default App;
