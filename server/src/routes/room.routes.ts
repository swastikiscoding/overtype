import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    createRoomSchema,
    joinRoomSchema,
} from "../validators/room.validator.js";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomDetails,
} from "../controllers/room.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(createRoomSchema), createRoom);
router.post("/join", authMiddleware, validate(joinRoomSchema), joinRoom);
router.post("/leave", authMiddleware, leaveRoom);
router.get("/:roomCode", authMiddleware, getRoomDetails);

export default router;
