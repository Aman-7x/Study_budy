import Blog from "../model/Blog.js";
import User from "../model/User.js";

// Get All Blogs
export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        return res.status(500).json({ message: "Fetching blogs failed." });
    }
    if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No Blogs Found." });
    }
    return res.status(200).json({ blogs });
};

// Add a New Blog
export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;

    
    // Check if the user exists
    let existingUser;
    try {
        existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error finding user." });
    }

    // Create a new blog
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });


        // Save blog and link it to the user
        try {
            await blog.save(); // Save the blog directly without a session
            existingUser.blogs.push(blog); // Add the blog reference to the user's blogs
            await existingUser.save(); // Save the user directly
        } catch (err) {
            console.error("Error creating blog:", err);
            return res.status(500).json({ message: "Error creating blog.", error: err });
        }
        

    return res.status(201).json({ blog });
};

// Update Blog
export const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true } // Returns the updated blog
        );
    } catch (err) {
        return res.status(500).json({ message: "Error updating blog." });
    }

    if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({ blog });
};

// Get Blog By ID
export const getById = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching blog." });
    }

    if (!blog) {
        return res.status(404).json({ message: "No Blog Found." });
    }

    return res.status(200).json({ blog });
};

// Delete Blog
export const deleteBlog = async (req, res, next) => {
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndDelete(blogId).populate("user");
        if (blog && blog.user) {
            blog.user.blogs.pull(blog);
            await blog.user.save();
        }
    } catch (err) {
        return res.status(500).json({ message: "Error deleting blog." });
    }

    if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({ message: "Successfully deleted blog." });
};

export const getByUserId = async (req, res, next ) => {
    const userId = req.params.id;
    let userBlogs;
    try {
    userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return console.log(err);
    }
    if(!userBlogs) {
        return res.status(404).json({message: "No Blogs Found"})
    }
    return res.status(200).json({blogs:userBlogs});
}