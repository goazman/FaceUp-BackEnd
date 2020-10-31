var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary').v2;
var request = require('sync-request');

cloudinary.config({ 
  cloud_name: 'dwn8abrli', 
  api_key: '612734465662752', 
  api_secret: 'fRZf7Mu7pKSm_qeCjf1Jf01HWkg' 
});

const axios = require('axios').default;

// Add a valid subscription key and endpoint to your environment variables.
let subscriptionKey = '82832fdbc0ec4597b10c25b1bde4fbbc'
let endpoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST Photo upload from frontend
const fs = require('fs')
var uniqid = require('uniqid');
const { json } = require('express');

router.post('/upload', async function(req, res, next) {

  // console.log(req.files.userPic);

  var imagePath = './tmp/'+uniqid()+'.jpg';
  var resultCopy = await req.files.userPic.mv(imagePath);

  if(!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath);

var cognitiveData = [];

    axios({
      method: 'post',
      url: endpoint,
      params : {
          returnFaceId: true,
          returnFaceLandmarks: false,
          returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
      },
      data: {
          url: resultCloudinary.url,
      },
      headers: {'Ocp-Apim-Subscription-Key': subscriptionKey}
    }).then(function (response) {
      console.log('Status text: ' + response.status)
      console.log('Status text: ' + response.statusText)
      // console.log(response.data[0].faceAttributes.hair.hairColor[0]);
      // response.data.forEach((face) => {
      //   console.log('Face ID: ' + face.faceId)
      //   console.log('Face rectangle: ' + face.faceRectangle.top + ', ' + face.faceRectangle.left + ', ' + face.faceRectangle.width + ', ' + face.faceRectangle.height)
      //   console.log('Smile: ' + face.faceAttributes.smile)
      //   console.log('Head pose: ' + JSON.stringify(face.faceAttributes.headPose))
      //   console.log('Gender: ' + face.faceAttributes.gender)
      //   console.log('Age: ' + face.faceAttributes.age)
      //   console.log('Facial hair: ' + JSON.stringify(face.faceAttributes.facialHair))
      //   console.log('Glasses: ' + face.faceAttributes.glasses)
      //   console.log('Smile: ' + face.faceAttributes.smile)
      //   console.log('Emotion: ' + JSON.stringify(face.faceAttributes.emotion))
      //   console.log('Blur: ' + JSON.stringify(face.faceAttributes.blur))
      //   console.log('Exposure: ' + JSON.stringify(face.faceAttributes.exposure))
      //   console.log('Noise: ' + JSON.stringify(face.faceAttributes.noise))
      //   console.log('Makeup: ' + JSON.stringify(face.faceAttributes.makeup))
      //   console.log('Accessories: ' + JSON.stringify(face.faceAttributes.accessories))
      //   console.log('Hair: ' + JSON.stringify(face.faceAttributes.hair))
      //   console.log()
      // });
      res.json({image: resultCloudinary.url, genre: response.data[0].faceAttributes.gender, age: response.data[0].faceAttributes.age, visage: response.data[0].faceAttributes.facialHair[0], emotion: response.data[0].faceAttributes.emotion[0], cheveux: response.data[0].faceAttributes.hair.hairColor[0]});
    }).catch(function (error) {
      console.log(error)
    });
  
    fs.unlinkSync(imagePath);
 
  } else {
    res.json({result: false, message: resultCopy} );
  } 

});


module.exports = router;


// ,genre: response.data[0].faceAttributes.gender, age: response.data[0].faceAttributes.age, visage: response.data[0].faceAttributes.facialHair, emotion: response.data[0].faceAttributes.emotion, cheveux: response.data[0].faceAttributes.hair