// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fs             = require('fs');
var url            = require('url');
var ObjectId	   = require('mongodb').ObjectID;

//other variables ==========================================

utils = {};//stub, will be extended later

// configuration ===========================================
	
var db = 'mongodb://localhost/jCodeApp';

var port = process.env.PORT || 5555; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + db + '! ' + err);
    } else {
        console.log('Successfully connected to: ' + db);
    }
});

// models ==================================================

//var model = require('./app/models');

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json({limit:'16mb'}));// parse application/json 
app.use(bodyParser.json({ limit:'16mb', type: 'application/*+json'})); // parse application/vnd.api+json as json application/*+json limit:'16mb',
//app.use(bodyParser.raw({ type: '*/*'})); 
app.use(bodyParser.urlencoded({limit:'16mb', extended: true })); // parse application/x-www-form-urlencoded
//app.use(bodyParser.text({type: '*/*'}));
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// Routes ==================================================
//require('./app/routes')(app); // configure our routes
// var index_routes = require('./app/routes/routes.js');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// middleware to use for all requests
router.use(function(req, res, next) {
	// Enable CORS on ExpressJS middleware

	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  	// logging
	console.log('jCdoe App. Time: ', Date.now());
	next(); // make sure we go to the next routes and don't stop here
});




// start app ===============================================
app.listen(port);										// startup our app at http://localhost:5555
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app



// **********************************************************
// models
// **********************************************************
	
var
fileschema = null,
tasklistschema = null,
testplanschema = null,

//define layout schema
//***************************************************
fileschema = new mongoose.Schema({
    filename: String,
    filexml: String
}),

tasklistschema = new mongoose.Schema({
	jcode: String,
	task: String,
	resp: String
}),

testplanschema = new mongoose.Schema({
	jcode: String,
	testList: String
})

wbtitlesschema = new mongoose.Schema({
    Section: String,
    JCodes: String,
    Title: String,
    SolutionType: String,
    EquipmentType: String,
    CRMEquipment: Boolean,
    fields: []
})

wbsectionsschema = new mongoose.Schema({
	Title: String,
	ImagePath: String
})

//define data models, using the schemas that we just created
taskfile = mongoose.model('project', fileschema);
tasklist = mongoose.model('tasklist', tasklistschema);
testplan = mongoose.model('testplan', testplanschema);
wbtitles = mongoose.model('wbtitles', wbtitlesschema);
wbsections = mongoose.model('wbsections', wbsectionsschema);

// ====================================================
// File route
// ====================================================
router.route('/taskfile')
   
   // get all task Files (access at GET http://localhost:5555/api/taskfile)
	.get(function(req, res) {
		taskfile.find(function(err, file) {
			if (err)
				res.send(err);

			res.json(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/taskfile)
	.post(function(req, res) {
	    var filename = req.body.filename;
	    var xml = req.body.filexml;
	  console.log("filename:"+filename);
	    //add a new document to the collection
	    newfile = new taskfile({
	        filename: filename,
	        filexml: xml
	    });
	    console.log("Filename:"+filename);
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.json(file);
		});
    })

// on routes that end in /taskfile/:_id
router.route('/taskfile/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/taskfile/:_id)
	.get(function(req, res){
		taskfile.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.json(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/taskfile/:_id)
	.put(function(req, res){
		// use taskfile model to find the file we want
		taskfile.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var filename = req.body.filename;

			if (filexml)
				file.filexml = filexml; //update xml
			if (filename)
				file.filename = filename; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this filename (access at DELETE http://localhost:5555/api/taskfile/:filename)
	.delete(function(req, res){
		taskfile.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.json({message: 'Successfully deleted'});
		});
	});

//*******************************************
// on routes that end in /taskfile/filename
router.route('/taskfile/search/:filename')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/taskfile/:_id)
	.get(function(req, res){
		taskfile.findOne({"filename": req.params.filename}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/taskfile/filename)
	.put(function(req, res){
		// use taskfile model to find the file we want
		taskfile.findOne({"filename": req.params.filename}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var filename = req.params.filename;

			if (filexml)
				file.filexml = filexml; //update xml
			if (filename)
				file.filename = filename; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	});




// *******************************************************************
// ===================================================================
// tasklist web service
// ===================================================================
// *******************************************************************

router.route('/tasklist')
   
   // get all task Files (access at GET http://localhost:5555/api/tasklist)
	.get(function(req, res) {
		tasklist.find(function(err, file) {
			if (err)
				res.send(err);

			res.jsonp(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/tasklist)
	.post(function(req, res) {
	    var jcode = req.body.jcode;
	    var task = req.body.task;
	    var resp = req.body.resp;
	  
	    //add a new document to the collection
	    newfile = new tasklist({
	        jcode: jcode,
	        task: task,
	        resp: resp
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.jsonp(file);
		});
    })

// on routes that end in /tasklist/:_id
router.route('/tasklist/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/tasklist/:_id)
	.get(function(req, res){
		tasklist.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/tasklist/:_id)
	.put(function(req, res){
		// use tasklist model to find the file we want
		tasklist.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var task = req.body.task;
			var jcode = req.body.jcode;
			var resp = req.body.resp;

			if (task)
				file.task = task; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname
			if (resp)
				file.resp = resp; //update responsibility

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/tasklist/:jcode)
	.delete(function(req, res){
		tasklist.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.jsonp({message: 'Successfully deleted'});
		});
	});

//*******************************************
// on routes that end in /tasklist/jcode
router.route('/tasklist/search/:jcode')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/tasklist/:_id)
	.get(function(req, res){
		tasklist.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/tasklist/jcode)
	.put(function(req, res){
		// use tasklist model to find the file we want
		tasklist.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);

			var task = req.body.task;
			var jcode = req.params.jcode;
			var resp = req.body.resp;

			if (task)
				file.task = task; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname
			if (resp)
				file.resp = resp; //update responsibility

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

// *******************************************************************
// ===================================================================
// testplan web service
// ===================================================================
// *******************************************************************

router.route('/testplan')
   
   // get all task Files (access at GET http://localhost:5555/api/testplan)
	.get(function(req, res) {
		testplan.find(function(err, file) {
			if (err)
				res.send(err);

			res.jsonp(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/testplan)
	.post(function(req, res) {
	    var jcode = req.body.jcode;
	    var testList = req.body.testList;
	  
	    //add a new document to the collection
	    newfile = new testplan({
	        jcode: jcode,
	        testList: testList
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.jsonp(file);
		});
    })

// on routes that end in /testplan/:_id
router.route('/testplan/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/testplan/:_id)
	.get(function(req, res){
		testplan.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/testplan/:_id)
	.put(function(req, res){
		// use testplan model to find the file we want
		testplan.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var testList = req.body.testList;
			var jcode = req.body.jcode;

			if (testList)
				file.testList = testList; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/testplan/:jcode)
	.delete(function(req, res){
		testplan.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.jsonp({message: 'Successfully deleted'});
		});
	});

//*******************************************
// on routes that end in /testplan/jcode
router.route('/testplan/search/:jcode')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/testplan/:_id)
	.get(function(req, res){
		testplan.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/testplan/jcode)
	.put(function(req, res){
		// use testplan model to find the file we want
		testplan.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);

			var testList = req.body.testList;
			var jcode = req.params.jcode;

			if (testList)
				file.testList = testList; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

// *******************************************************************
// ===================================================================
// WBTitles web service
// ===================================================================
// *******************************************************************

router.route('/wbtitles')
   
   // get all wbtitles (access at GET http://localhost:5555/api/wbtitles)
	.get(function(req, res) {
		wbtitles.find(function(err, file) {
			if (err)
				res.send(err);

			res.jsonp(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/wbtitles)
	.post(function(req, res) {
		var r = req.body;
	    var section = r.Section;
	    var jcodes = r.JCodes;
	    var title = r.Title;
	    var solutiontype = r.SolutionType;
	    var equipmenttype = r.EquipmentType;
	    var crmequipment = r.CRMEquipment;
	    var fields = r.fields;

	  
	    //add a new document to the collection
	    newfile = new wbtitles({
	        Section: section,
		    JCodes: jcodes,
		    Title: title,
		    SolutionType: solutiontype,
		    EquipmentType: equipmenttype,
		    CRMEquipment: crmequipment,
		    fields: fields
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.jsonp(file);
		});
    })

// on routes that end in /testplan/:_id
router.route('/wbtitles/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/wbtitles/:_id)
	.get(function(req, res){
		wbtitles.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/wbtitles/:_id)
	.put(function(req, res){
		// use wbtitles model to find the file we want
		wbtitles.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var r = req.body;
		    var section = r.Section;
		    var jcodes = r.JCodes;
		    var title = r.Title;
		    var solutiontype = r.SolutionType;
		    var equipmenttype = r.EquipmentType;
		    var crmequipment = r.CRMEquipment;
		    var fields = r.fields;

			// Set fields to update document
			if (section){
				file.Section = section;
			}
			if (jcodes) {
		    	file.JCodes = jcodes;
		    }
		    if (title) {
		    	file.Title = title;
		    }
		    if (solutiontype) {
		    	file.SolutionType = solutiontype;
		    }
		    if (equipmenttype){
		    	file.EquipmentType = equipmenttype;
		    }
		    if (crmequipment) {
		    	file.CRMEquipment = crmequipment;
		    	console.log("crmequipment: " + crmequipment);
		    }
		    if (fields) {
		    	file.fields = fields;
		    }

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("wbtitles File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/wbtitles/:jcode)
	.delete(function(req, res){
		wbtitles.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.jsonp({message: 'Successfully deleted'});
		});
	});

	// *******************************************************************
// ===================================================================
// wbSections web service
// ===================================================================
// *******************************************************************

router.route('/wbsections')
   
   // get all wbsections (access at GET http://localhost:5555/api/wbsections)
	.get(function(req, res) {
		wbsections.find(function(err, file) {
			if (err)
				res.send(err);

			res.jsonp(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/wbsections)
	.post(function(req, res) {
	    var title = req.body.Title;
	    var imagepath = req.body.ImagePath;
	  
	    //add a new document to the collection
	    newfile = new wbsections({
	        Title: title,
	        ImagePath: imagepath
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.jsonp(file);
		});
    })

// on routes that end in /wbsections/:_id
router.route('/wbsections/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/wbsections/:_id)
	.get(function(req, res){
		wbsections.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.jsonp(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/wbsections/:_id)
	.put(function(req, res){
		// use wbsections model to find the file we want
		wbsections.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var title = req.body.Title;
	    	var imagepath = req.body.ImagePath;

			if (title)
				file.Title = title; //update xml
			if (imagepath)
				file.ImagePath = imagepath; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.jsonp({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/wbsections/:jcode)
	.delete(function(req, res){
		wbsections.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.jsonp({message: 'Successfully deleted'});
		});
	});
