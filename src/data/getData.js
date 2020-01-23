
var imagesMap = {};

var images = document.querySelectorAll('.product-image');

console.log(images);

images.forEach(img => {

    if(!imagesMap[img.title]) {
        imagesMap[img.title] = [];
        imagesMap[img.title].push(img.src);
    } else {
        imagesMap[img.title].push(img.src);
    }

});

for (let key in imagesMap) {

    if(imagesMap[key].length === 0) {
        delete imagesMap[key];
    }

    if(!imagesMap[key][0]) {
        imagesMap[key].splice(0,1);
    }


}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

brand
var product = Object.keys(imagesMap).reduce((acc, key , i) => {

    if(imagesMap[key].length !== 0) {
        var newPhone = {
            price: getRandomArbitrary(1500, 10000),
            condition: "used"
        };
        newPhone.title = key;
        newPhone.brand = key.split(' ')[0].toLowerCase();
        newPhone.category = 'phone';
        newPhone.images = imagesMap[key];

        acc.push(newPhone);
    }

    return acc;
}, []);

console.log(JSON.stringify(product));