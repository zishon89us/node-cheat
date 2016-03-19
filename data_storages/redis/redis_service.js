/**
 * Created by Muhammad AbdulMoiz on 3/17/2016.
 *
 * /
 /*
 Redis Node Service which provides some CRUD functionalities
 getList getDocument
 saveDocument saveList saveListOfDocuments removeDocument removeList
 removeListItem removeDocumentFromList findAllDocByKeyPrefix(Use redis pipeline functionality for multiple hits)
 */

var redisStore = (function(){
    var RedisStore = function(){

    };



    RedisStore.prototype.init = function(redisClient){
        this.client = redisClient;//Initializing redis client
    };

    /*
    * Fetch and return list from redis
    * */
    RedisStore.prototype.getList = function(label, callBack){
        this.client.lrange(label, [0, -1], function(err, value){
            if(err){
                return callBack(err);
            }
            callBack(null, value);
        });
    };
    /*
    *Fetch and return Document/Dictionary/Object from redis
    * */
    RedisStore.prototype.getDocument = function(label, callBack){
        this.client.hgetall(label, function(err, dictionary){
            if(err){
                console.log('Error occured while saving to redis: ' + err);
                return  callBack(err);
            }
            callBack(null, dictionary);
        });
    };
    /*
    * A way of storing a Document/Dictionary/Object in redis
    * */
    RedisStore.prototype.saveDocument = function(label, document){
        this.client.hmset(label, document, function(){
            // console.log(arguments);
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }

        });
    };
    /*
     * A way of pushing value in a List/Array in redis
     * */
    RedisStore.prototype.saveList = function(label, value){
        this.client.rpush(label, value, function(err, values){
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }
            //success case
        });

    };
    /*
     * A way of storing a list of documents i.e array of objects
     * */
    RedisStore.prototype.saveListOfDocuments = function(documentLabel, listLabel, document/*must contain a unique id*/){
        var context = this;
        //assume document has a unique key 'id'
        this.client.hmset(documentLabel, document, function(){
            context.client.rpush(listLabel, documentLabel, function(err, values){
                if(err){
                    console.log('Error occured while saving to redis : '+ err);
                }
                //success case
            });
        });

    };


    /*
    * Remove a Document/Dictionary/Object from redis
    * */
    RedisStore.prototype.removeDocument = function(label){
        this.client.del(label, function(err, values){
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }
            //success case
        });

    };

    /*
    * Remove a list from redis
    * */

    RedisStore.prototype.removeList = function(label){
        this.client.lrem(label, [0, -1], function(err, values){
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }
            //success case

        });
    };

    /*
     * Remove a single item of list  from redis by
     * */

    RedisStore.prototype.removeListItem = function(label, item){
        this.client.lrem(label, [0, item], function(err, values){
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }
            //success case

        });
    };
    /*
    * Remove a document from list of document
    * */

    RedisStore.prototype.removeDocumentFromList = function(listLabel, documentLabel, documentId){
        var context = this;
        this.client.lrem(listLabel, [0, documentId], function(err, values){
            if(err){
                console.log('Error occured while saving to redis : '+ err);
            }
            context.client.del(documentLabel, function(err, values){
                if(err){
                    console.log('Error occured while saving to redis : '+ err);
                }
                //success case
            });

        });
    };
    /*
    * Finding all documents with a labelPrefix and responding via callback
    * Note: In the same way labelPostFix and others can also be uses
    * Its similar to a like query in SQL
    * Use redis pipelince functionality for multiple hits
    * */
    RedisStore.prototype.findAllDocByKeyPrefix = function(labelPrefix, callback){
        var allDocs = [];
        var context = this;
        this.client.keys(labelPrefix+":*", function(err, keys){
            if(err){
                console.log('*****************REDIS ERROR OCCURED*********************');
                console.log(err);
                console.log('*****************REDIS ERROR OCCURED*********************');
                return callback(err);
            }
            if(!keys) keys = [];
            var pipe = context.client.pipeline();
            keys.forEach(
                function(key){
                    pipe.hgetall(key);
                }
            );
            pipe.exec(function (err, collection) {
                if(err){
                    console.log('***********ERROR IN REDIS PIPELINE**************');
                    console.log(err);
                    console.log('***********ERROR IN REDIS PIPELINE**************');
                    return callback(err);
                }
                console.log('***********REDIS PIPELINE RESULTS:'+ type +'**************');
                console.log(collection);
                console.log('***********REDIS PIPELINE RESULTS:'+ type +'**************');
                collection.forEach(
                    function(results){
                        if(!results || results[0]) results = [null, {}];
                        allDocs.push(results[1]);
                    }
                );
                callback(null, allDocs);
            });
        })

    };
    return new redisStore();
})();

module.exports = redisStore;
