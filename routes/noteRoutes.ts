import * as express from "express";
import { noteController } from "../controller/notesController";

const router = express.Router();

router.get("/", noteController.showIndex.bind(noteController));
router.get("/notes", noteController.createNote.bind(noteController));
router.post("/notes", noteController.addNote.bind(noteController));
router.get("/notes/:id/", noteController.editNote.bind(noteController));
router.post("/notes/:id/", noteController.updateNote.bind(noteController));

export default router;
