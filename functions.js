const axios = require('axios');
const { usertoken, secrettoken, categories } = require('./config.json');
let inappropriateImage = false;

/**
 * The function checks an image for inappropriate content using the Sightengine API.
 * @param imageUrl - The URL of the image that needs to be checked for inappropriate content.
 * @returns an object with two properties: "response" and "inappropriateImage". The "response" property
 * contains the response data from the API call made using the axios library, and the
 * "inappropriateImage" property is a boolean value indicating whether the image is inappropriate or
 * not, based on the analysis of the image data received from the API.
 */
async function checkImage(imageUrl) {
  inappropriateImage = false;
  try {
    const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
      params: {
        url: imageUrl,
        models: categories,
        api_user: usertoken,
        api_secret: secrettoken,
      },
    });
    analyseImageAPIData(response.data);
    return { response, inappropriateImage };
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

/**
 * The function checks if a given string ends with a valid image file type.
 * @param str - The input string that represents the file name or file path of an image file.
 * @returns a boolean value (true or false) depending on whether the input string ends with one of the
 * image file types in the `imageFileTypes` array.
 */
function checkImageValidity(str) {
  const imageFileTypes = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
  for (let i = 0; i < imageFileTypes.length; i++) {
    const fileType = imageFileTypes[i];
    if (str.toLowerCase().endsWith(fileType)) {
      return true;
    }
  }
  return false;
}
/**
 * The function analyses image API data by iterating through categories and inner objects, and
 * comparing numerical values.
 * @param response - The response object that contains image analysis data.
 */

function analyseImageAPIData(response) {
  const categories = Object.keys(response);

  categories.forEach(category => {
    if (typeof response[category] === 'object') {
      const innerObjects = Object.keys(response[category]);

      innerObjects.forEach(i => {
        if (
          typeof response[category][i] === 'number' &&
          i !== 'timestamp' &&
          i !== 'operations' &&
          i !== 'none'
        ) {
          compareAPIData(response[category][i]);
        }
      });
    } else if (typeof response[category] === 'number') {
      compareAPIData(response[category]);
    }
  });
}


/**
 * The function compares a category confidence value to 0.5 and sets a boolean variable to true if it
 * is greater than or equal to 0.5.
 * @param categoryConfidence - a number representing the confidence level of an image recognition
 * algorithm in identifying a certain category of image. If the confidence level is equal to or greater
 * than 0.5, the function sets the variable inappropriateImage to true, indicating that the image is
 * inappropriate.
 * @returns the value of the variable `inappropriateImage`, which is either `true` or `false` depending
 * on the value of the `categoryConfidence` parameter.
 */
function compareAPIData(categoryConfidence) {
  if (categoryConfidence >= 0.5) {
    inappropriateImage = true;
  }
  return inappropriateImage;
}

module.exports = { checkImage, inappropriateImage, checkImageValidity, compareAPIData };
