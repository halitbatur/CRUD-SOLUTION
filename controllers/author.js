// Start coding here
const BlogPostModel = require("../models/blog-post");

const getAllAuthors = async (_, res) => {
    try {
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
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
};

/* NOTE: This is an alternate solution to the above function
If we use the alternate function addBlogPostWithUniqueAuthorId which reuses author IDs and hence ensures unique author IDs, we can simplify the function using the Mongoose function distinct() which fetches unique values
*/
const getAllAuthorsWithUniqueAuthorId = async (_, res) => {
    try {
        // Fetch all unique authors using distinct function on the author field
        const authors = await BlogPostModel.distinct("author");
        res.json(Object.values(authors));
        // Return array of unique author objects
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
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

    try {
        const updatedBlogPosts = await BlogPostModel.updateMany(
            query,
        {
            $set: updateSet
        });
        res.json({updated: updatedBlogPosts});
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
};

module.exports = {
    getAllAuthors,
    getAllAuthorsWithUniqueAuthorId,
    updateAuthor
}