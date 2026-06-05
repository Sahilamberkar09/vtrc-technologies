import Blog from "./Blog.js";
import cloudinary from "../../config/cloudinaryConfig.js";

export const createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, tags, isPublished } = req.body;
    
    let coverImageUrl = "";
    if (req.file) {
      // Buffer upload to cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "vtrc/blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      coverImageUrl = await uploadPromise;
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: isPublished === "true" || isPublished === true,
      coverImage: coverImageUrl,
      author: req.user._id,
    });

    await newBlog.save();
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate("author", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name email");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, tags, isPublished } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "vtrc/blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      blog.coverImage = await uploadPromise;
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.category = category || blog.category;
    if (tags) blog.tags = JSON.parse(tags);
    if (isPublished !== undefined) blog.isPublished = isPublished === "true" || isPublished === true;

    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
