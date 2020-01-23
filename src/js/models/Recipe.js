import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            return this;
        } catch(error) {
            alert(error);
        }
    }
    
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    standardiseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'cup', 'pounds', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'cup', 'lb', 'lb'];
        const newIngredients = this.ingredients.map(el => {
            //standardise units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //remove parentheses
            ingredient = ingredient.replace(/ \([\s\S]*?\)/g, '')

            //parse
            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(elIng => unitsShort.includes(elIng));
            let objIngredient = {
                count: 1,
                unit: '',
                ingredient
            };

            if (unitIndex > -1) {
                const ingCount = parseInt(arrIngredient.slice(0, unitIndex));
                if (ingCount.length === 1) {
                    objIngredient.count = eval(arrIngredient[0].replace('-', '+'));
                } else {
                    objIngredient.count = eval(arrIngredient.slice(0, unitIndex).join('+'));
                }
                objIngredient.unit = arrIngredient[unitIndex];
                objIngredient.ingredient = arrIngredient.slice(unitIndex + 1).join(' ');

            } else if (parseInt(arrIngredient[0], 10)) {
                objIngredient.count = parseInt(arrIngredient[0]);
                objIngredient.ingredient = arrIngredient.slice(1).join(' ');
            }
            
            ingredient = objIngredient;
            return ingredient;
        });
        this.ingredients = newIngredients;
    }
    
    recalcServings (type) {
        // Servings
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            if (ing.count > 0) {
                ing.count *= (newServings / this.servings);
            }
        });

        this.servings = newServings;
    }
}
