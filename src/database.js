
  const { Datastore } = require('@google-cloud/datastore');
  const datastore = new Datastore();
  
exports.saveReviews = async (key, idenfier, ids) => {
  const taskKey = datastore.key([key, idenfier]);
  const task = {
    key: taskKey,
    data: {
      ids: ids
    },
  };
  await datastore.save(task);
}

exports.getReviews = async (key) => {
  const query = datastore.createQuery(key);
  const [tasks] = await datastore.runQuery(query);
  return tasks
}
