import { error } from "console";
import Document from "../models/Document.js";
import Flashcard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParse.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import mongoose from "mongoose";

//@desc upload pdf document
//@route POST/api/documents/upload
//@access  private

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "please upload a pdf file",
        statusCode: 400,
      });
    }
    const { title } = req.body;

    if (!title) {
      //delete uploaded file if no titile provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "please provide a document title",
        statusCode: 400,
      });
    }

    //construct the url for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    //create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl, //store the url instead of the local path
      fileSize: req.file.size,
      status: "processing",
    });

    // process pdf in background (in production,use a queue like bull)
    processPDF(document._id, req.file.path).catch((err) => {
      console.log(`pdf processing error`, err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "document uploaded successfully ,processing in progress..",
    });
  } catch (error) {
    //clean up file or error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};
///helper function to process pdf
const processPDF = async (documentId, filePath) => {
  try {
    const {text}=await extractTextFromPDF(filePath)

    //create chunks
    const { chunks } = chunkText(text, 500, 50);
    // update document
    await Document.findByIdAndUpdate(documentId, {
      extractText: text,
      chunks: chunks,
      status: "ready",
    });
    console.log(`Document ${documentId} processed succesfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};

//@desc get all user document
//@route GET/api/documents
//@access  private

export const getDocuments = async (req, res, next) => {
  try {
    const documents=await Document.aggregate([
      {
        $match:{userId:new mongoose.Types.ObjectId(req.user._id)}
      },{
        $lookup:{
          from:'flashcards',
          localField:'_id',
          foreignField:'documentId',
          as:'flashcardsSets'
        }
      },
      {
        $lookup:{
          from:'quizzers',
          localField:'_id',
          foreignField:'documentId',
          as:'quizzer'
        }
      },
      {
        $addFields:{
          flashcardCount:{$size:`$flashcardSets`},
          quizCount:{$size:`$quizzers`}
        }
      },
      {
        $project:{
          extractedTxt:0,
          chunks:0,
          flashcardSets:0,
          quizzes:0
        }
      },{
        $sort:{
          uploadDate:-1
        }
      }
    ])
    res.statusCode(200).json({
      success:true,
      count:documents.length,
      data:documents
    })
  } catch (error) {
    next(error);
  }
};
//@desc GET single document with chunks
//@route GET /api/documents/:id
//@access  private
export const getDocument = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
//@desc delete  document
//@route DELETE/api/documents/:id
//@access  private

export const deleteDocument = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
//@desc update document title
//@route PUT/api/documents/:id
//@access  private

export const updateDocument = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
