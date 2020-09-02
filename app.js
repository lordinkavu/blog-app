const express=require('express'),
mongoose     =require('mongoose'),
bodyParser   =require('body-parser'),
app          =express(),
//expressSanitizer=require('express-sanitizer'),
methodOverride = require('method-override');
mongoose.connect('mongodb://localhost/myselfIngaavu', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
app.set("view engine",'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressSanitizer());
app.use(methodOverride('_method'))

const blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created:{
        type: Date,
        default: Date.now
    },
});

const Blog=mongoose.model('Blog',blogSchema);
/* Blog.create({
    title: 'Sample Post',
    image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60',
    body: " Heyya people! This is a sample post. Don't be dejected though. We'll be up and running in a short while. Peace.",

},(err, blogEntry)=>{
    if(err){
        console.log(err)
    }else{
        console.log(blogEntry);
    }
}); */
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log("ERROR!");
        }else{
            res.render('index',{blogs:blogs});
        }
    })
    
});

app.get('/blogs/new',(req,res)=>{
    res.render('new');
})
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});

app.post('/blogs',(req,res)=>{
    //req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            console.log("ERROR!");
        }else{
            res.redirect('/blogs')
        }
    })
})
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById({ _id: req.params.id }, (err,foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
           res.render('edit',{blog:foundBlog});
        }
    })


    
})
app.put('/blogs/:id',(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updateddBlog)=>{
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs/'+req.params.id)
        }

    })
})
app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id',(req,res)=>{
   
     Blog.findById({ _id: req.params.id }, (err,foundBlog)=>{
         if(err){
             res.redirect('/blogs');
         }else{
            res.render('show',{blog:foundBlog});
         }
        
    })
}) 



app.listen(3000,()=>{
    console.log('Listening from port 3000')
});