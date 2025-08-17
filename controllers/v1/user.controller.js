import XLSX from "xlsx";
import config from "@/config";
import { MediaViewLog, Media } from "@/models";
import multer from "multer";
import isEmpty from "is-empty";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";

const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const media = async (req, res) => {
  try {
    const { body, file } = req;

    if (!body.title || !body.type || !file) {
      return res.status(400).json({ message: "Title, type, and a media file are required." });
    }

    if (body.type !== "video" && body.type !== "audio") {
      return res.status(400).json({ message: 'Type must be either "video" or "audio".' });
    }

    // Generate a unique file key for S3
    const fileKey = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

    // S3 Upload Command
    const uploadParams = {
      Bucket: config.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Save media asset metadata to the database
    const newMediaAsset = new Media({
      title: body.title,
      type: body.type,
      file_key: fileKey,
    });

    await newMediaAsset.save();

    res.status(201).json({
      message: "Media uploaded and metadata saved successfully.",
      mediaAsset: newMediaAsset,
    });
  } catch (error) {
    console.error("Media Upload Error:", error);
    res.status(500).json({ message: "Server error during media upload." });
  }
};

export const getMedia = async (req, res) => {
  const { params } = req;
  try {
    const mediaAsset = await Media.findById(params.id);

    if (!mediaAsset) {
      return res.status(404).json({ message: "Media asset not found." });
    }

    const getObjectParams = {
      Bucket: config.S3_BUCKET_NAME,
      Key: mediaAsset.file_key,
    };

    const command = new GetObjectCommand(getObjectParams);

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    res.status(200).json({
      message: "Secure streaming URL generated successfully.",
      stream_url: signedUrl,
      expires_in: "10 minutes",
    });
  } catch (error) {
    console.error("Stream URL Generation Error:", error);
    if (error.name === "NoSuchKey") {
      return res.status(404).json({ message: "The requested media file does not exist in storage." });
    }
    res.status(500).json({ message: "Server error while generating stream URL." });
  }
};

export const viewMedia = async(req,res)=>{
    const{params}=req
    try {
        const mediaAsset = await Media.findById(params.id);
        if (!mediaAsset) {
            return res.status(404).json({ message: 'Media asset not found.' });
        }

        const viewerIp = req.ip;
        const newViewLog = new MediaViewLog({
            media_id: mediaAsset._id,
            viewed_by_ip: viewerIp
        });

        await newViewLog.save();

        res.status(201).json({success:true, message: 'View logged successfully.' });

    } catch (error) {
        console.error('Media View Log Error:', error);
        res.status(500).json({success:false, message: 'Server error while logging view.' });
    }
}

export const analyticsView = async (req,res)=>{
    const{params}=req
    try {
        const mediaId = new mongoose.Types.ObjectId(params.id);

        const mediaAsset = await Media.findById(mediaId);
        if (!mediaAsset) {
            return res.status(404).json({ message: 'Media asset not found.' });
        }

        const stats = await MediaViewLog.aggregate([
            { $match: { media_id: mediaId } },
            {
                $group: {
                    _id: "$media_id",
                    total_views: { $sum: 1 },
                    unique_ips_set: { $addToSet: "$viewed_by_ip" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total_views: 1,
                    unique_ips: { $size: "$unique_ips_set" }
                }
            }
        ]);

        const dailyViews = await MediaViewLog.aggregate([
            { $match: { media_id: mediaId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } 
        ]);

        const analyticsResult = {
            total_views: stats.length > 0 ? stats[0].total_views : 0,
            unique_ips: stats.length > 0 ? stats[0].unique_ips : 0,
            views_per_day: dailyViews.reduce((acc, day) => {
                acc[day._id] = day.count;
                return acc;
            }, {})
        };

        res.status(200).json({success:true,data:analyticsResult});

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ success:false,message: 'Server error while fetching analytics.' });
    }
}