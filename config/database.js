if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb+srv://buchilazarus:4evavictorious@postjot-c1mzf.mongodb.net/test?retryWrites=true'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/postjot-dev'}
}