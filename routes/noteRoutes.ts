import * as express from "express";
import { notesController } from "../controller/notesController2";

const router = express.Router();

router.get("/", notesController.showIndex.bind(notesController));
router.get("/notes", notesController.createNote.bind(notesController));
router.post("/notes", notesController.addNote.bind(notesController));
router.get("/notes/:id/", notesController.editNote.bind(notesController));
router.post("/notes/:id/", notesController.updateNote.bind(notesController));

export default router;
