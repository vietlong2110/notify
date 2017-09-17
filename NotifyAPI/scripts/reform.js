const { Sources } = require('../database');

const reduceArr = arr => {
  let data = [];
  for (i = 0; i < arr.length; i++)
    if (data.indexOf(arr[i]) === -1)
      data = [...data, arr[i]];
  return data;
};

const reduceRSS = async() => {
  let sources = await Sources.find().exec();
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    source.links = reduceArr(source.links);
    try {
      await source.save();
    } catch(err) {
      console.log(err);
    }
  }
  console.log('Reduced successfully!');
};

reduceRSS();
