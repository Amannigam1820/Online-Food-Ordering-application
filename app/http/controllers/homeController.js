const Menu = require('../../models/menu');

function homeContoller(){
    return {
        async index(req,res) {
            const foods = await Menu.find()
            console.log(foods)
            return res.render('home',{foods:foods})
            
            // Menu.find().then(function(foods){
            //     console.log(foods);
            //     res.render('home',{foods:foods})
            // })

            
        }
    }
}

module.exports = homeContoller