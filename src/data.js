const allIngredients = [
   "Egg",
   "Milk",
   "Bread",
   "Chicken",
   "Rice",
   "Tomatoes",
   "Onions",
   "Garlic",
   "Cheese",
   "Spinach",
   "Potatoes",
   "Olive oil"
 ];
 
 const recipes = [
   {
     name: "Egg Salad",
     ingredients: ["Egg", "Mayonnaise", "Bread", "Onions"],
     imageUrl: "/assets/eggSalad.jpg",
     prepTime: 15
   },
   {
     name: "Chicken Curry",
     ingredients: ["Chicken", "Rice", "Onions", "Tomatoes", "Garlic"],
     imageUrl: "/assets/chickenCurry.jpg",
     prepTime: 45
   },
   {
     name: "Cheese Sandwich",
     ingredients: ["Bread", "Cheese", "Onions", "Tomatoes"],
     imageUrl: "/assets/cheeseSandwich.jpg",
     prepTime: 10
   },
   {
     name: "Garlic Bread",
     ingredients: ["Bread", "Garlic", "Olive oil"],
     imageUrl: "/assets/garlicBread.jpg",
     prepTime: 20
   },
   {
     name: "Spinach Salad",
     ingredients: ["Spinach", "Olive oil", "Tomatoes", "Onions"],
     imageUrl: "/assets/spinachSalad.jpg",
     prepTime: 10
   },
   {
     name: "Potato Soup",
     ingredients: ["Potatoes", "Milk", "Onions", "Cheese"],
     imageUrl: "/assets/potatoSoup.jpg",
     prepTime: 30
   },
   {
     name: "Tomato Soup",
     ingredients: ["Tomatoes", "Onions", "Olive oil", "Garlic"],
     imageUrl: "/assets/tomatoSoup.jpg",
     prepTime: 30
   },
   {
     name: "Rice Pudding",
     ingredients: ["Rice", "Milk", "Egg"],
     imageUrl: "/assets/ricePudding.jpg",
     prepTime: 40
   },
   {
     name: "Chicken Omelette",
     ingredients: ["Chicken", "Egg", "Cheese", "Tomatoes"],
     imageUrl: "/assets/chickenOmelette.jpg",
     prepTime: 20
   },
   {
     name: "Spinach Quiche",
     ingredients: ["Spinach", "Egg", "Cheese", "Milk"],
     imageUrl: "/assets/spinachQuiche.jpg",
     prepTime: 45
   },
   {
     name: "Cheesy Garlic Bread",
     ingredients: ["Bread", "Garlic", "Cheese", "Olive oil"],
     imageUrl: "/assets/cheesyGarlicBread.jpg",
     prepTime: 25
   },
   {
     name: "Potato Omelette",
     ingredients: ["Potatoes", "Egg", "Onions", "Olive oil"],
     imageUrl: "/assets/potatoOmelette.jpg",
     prepTime: 20
   },
   {
     name: "Creamy Spinach Soup",
     ingredients: ["Spinach", "Milk", "Onions", "Garlic"],
     imageUrl: "/assets/creamySpinachSoup.jpg",
     prepTime: 30
   },
   {
     name: "Tomato Cheese Toast",
     ingredients: ["Bread", "Tomatoes", "Cheese", "Garlic"],
     imageUrl: "/assets/tomatoCheeseToast.jpg",
     prepTime: 15
   },
   {
     name: "Chicken Rice Casserole",
     ingredients: ["Chicken", "Rice", "Cheese", "Onions", "Milk"],
     imageUrl: "/assets/chickenRiceCasserole.jpg",
     prepTime: 50
   },
   {
     name: "Egg Fried Rice",
     ingredients: ["Rice", "Egg", "Onions", "Olive oil"],
     imageUrl: "/assets/eggFriedRice.jpg",
     prepTime: 20
   },
   {
     name: "Mashed Potatoes",
     ingredients: ["Potatoes", "Milk", "Butter", "Cheese"],
     imageUrl: "/assets/mashedPotatoes.jpg",
     prepTime: 25
   },
   {
     name: "Chicken Spinach Salad",
     ingredients: ["Chicken", "Spinach", "Tomatoes", "Olive oil"],
     imageUrl: "/assets/chickenSpinachSalad.jpg",
     prepTime: 15
   },
   {
     name: "Garlic Chicken Pasta",
     ingredients: ["Chicken", "Garlic", "Olive oil", "Onions", "Cheese"],
     imageUrl: "/assets/garlicChickenPasta.jpg",
     prepTime: 40
   },
   {
     name: "Egg and Spinach Scramble",
     ingredients: ["Egg", "Spinach", "Onions", "Tomatoes", "Cheese"],
     imageUrl: "/assets/eggSpinachScramble.jpg",
     prepTime: 20
   }
 ];

 export {recipes, allIngredients};