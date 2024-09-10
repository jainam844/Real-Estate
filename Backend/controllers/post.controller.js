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
        const post = await prisma.post.findUnique({
            where: { id }, include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            }
        });
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
    const { postData, postDetail } = req.body;  // Destructure to get postData and postDetail
    const tokenUserId = req.userId;

    try {
        // Ensure postData and postDetail are correctly structured
        if (!postData || !postDetail) {
            return res.status(400).json({ message: "Missing required data" });
        }

        const newPost = await prisma.post.create({
            data: {
                ...postData,
                userId: tokenUserId,
                postDetail: {
                    create: postDetail,
                },
            },
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
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
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized!" });
        }

        await prisma.post.delete({
            where: { id },
        });

        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post" });
    }
};