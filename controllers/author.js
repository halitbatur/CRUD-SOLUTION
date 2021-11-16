// Start coding here
const BlogPostModel = require("../models/blog-post");

const getAllAuthors = async (_, res) => {
    // First fetch all blog posts
    const blogPosts = await BlogPostModel.find();
    const authors = {};
    /* Create a unique map of authors, it will look like this:
    {
        author1Name: {author1},
        author2Name: {author2},
        author3Name: {author3},
        ... and so on
    }
    */
    blogPosts.forEach(blogPost => {
        if (!authors[blogPost.author.name])
            authors[blogPost.author.name] = blogPost.author;
    })
    // The above check ensures that only unique authors are mapped, repeated authors will be skipped
    res.json(Object.values(authors));
    // Return array of unique author objects
};

const updateAuthor = async (req, res) => {
    const authorName = req.params.name;
    const query = {
        "author.name": authorName
    };
    const updateSet = {};
    /* Request body might give us values like this:
    {
        age: 28,
        areasOfExpertise: ["design", "ux/ui", "art"]
    }
    */
    Object.keys(req.body).forEach(key => {
        updateSet[`author.${key}`] = req.body[key]
    });
    /* The above logic changes to:
    {
        "author.age": 28,
        "author.areasOfExpertise": ["design", "ux/ui", "art"]
    }
    Since MongoDB query requires nested keys for author object
    */
    const updatedBlogPosts = await BlogPostModel.updateMany(
        query,
    {
        $set: updateSet
    });
    res.json({updated: updatedBlogPosts});
};

module.exports = {
    getAllAuthors,
    updateAuthor
}