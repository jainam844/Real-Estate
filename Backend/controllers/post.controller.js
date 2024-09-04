import prisma from "../lib/prisma.js";

// Function to get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany(); // Fetch posts from the database using Prisma
        res.status(200).json(posts); // Return the posts in the response
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
};

// Define other route handlers (stubs to be implemented)
export const getPost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get post" });
    }
};

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId
    try {

        const newPost = await prisma.post.create({
            data: { ...body, userId: tokenUserId },
        });
        res.status(201).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add post" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const tokenUserId = req.userId
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content },
        });
        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update post" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const tokenUserId = req.userId
        if (id !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized!" });
        }
        await prisma.post.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post" });
    }
};
