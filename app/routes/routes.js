//routes

var express = require('express');
var router = express.Router();

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
	  
	    //add a new document to the collection
	    newfile = new taskfile({
	        filename: filename,
	        filexml: xml
	    });
	    
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
			res.json(file);
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

			res.json(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/tasklist)
	.post(function(req, res) {
	    var jcode = req.body.jcode;
	    var filexml = req.body.filexml;
	  
	    //add a new document to the collection
	    newfile = new tasklist({
	        jcode: jcode,
	        filexml: filexml
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.json(file);
		});
    })

// on routes that end in /tasklist/:_id
router.route('/tasklist/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/tasklist/:_id)
	.get(function(req, res){
		tasklist.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.json(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/tasklist/:_id)
	.put(function(req, res){
		// use tasklist model to find the file we want
		tasklist.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var jcode = req.body.jcode;

			if (filexml)
				file.filexml = filexml; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/tasklist/:jcode)
	.delete(function(req, res){
		tasklist.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.json({message: 'Successfully deleted'});
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
			res.json(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/tasklist/jcode)
	.put(function(req, res){
		// use tasklist model to find the file we want
		tasklist.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var jcode = req.params.jcode;

			if (filexml)
				file.filexml = filexml; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
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

			res.json(file);
		});
	})

   // Create a new file (access at POST http://localhost:5555/api/testplan)
	.post(function(req, res) {
	    var jcode = req.body.jcode;
	    var filexml = req.body.filexml;
	  
	    //add a new document to the collection
	    newfile = new testplan({
	        jcode: jcode,
	        filexml: filexml
	    });
	    
	    //save the new document
	    newfile.save(function (err, file) {
	        if (err) console.log('Error on save!')

	        res.json(file);
		});
    })

// on routes that end in /testplan/:_id
router.route('/testplan/:_id')
	
	// get File with the file ID (accessed at GET http://localhost:5555/api/testplan/:_id)
	.get(function(req, res){
		testplan.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);
			res.json(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/testplan/:_id)
	.put(function(req, res){
		// use testplan model to find the file we want
		testplan.findOne({"_id": ObjectId(req.params._id)}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var jcode = req.body.jcode;

			if (filexml)
				file.filexml = filexml; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

	// delete the File with this jcode (access at DELETE http://localhost:5555/api/testplan/:jcode)
	.delete(function(req, res){
		testplan.remove({"_id": ObjectId(req.params._id)}, function (err, layout) {
			if (err)
				res.send(err);
			res.json({message: 'Successfully deleted'});
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
			res.json(file);
		});
	})

	// update the file (access at PUT http://localhost:5555/api/testplan/jcode)
	.put(function(req, res){
		// use testplan model to find the file we want
		testplan.findOne({"jcode": req.params.jcode}, function(err, file){
			if (err)
				res.send(err);

			var filexml = req.body.filexml;
			var jcode = req.params.jcode;

			if (filexml)
				file.filexml = filexml; //update xml
			if (jcode)
				file.jcode = jcode; //update layoutname

			//save the layout
			file.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'File updated!'});
				console.log("File Updated! ...log");
			});
		});
	})

