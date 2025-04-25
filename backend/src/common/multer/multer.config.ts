import { diskStorage, FileFilterCallback } from 'multer';
import { Request } from 'express';
import * as path from 'path';

const allowedTypes = /jpeg|jpg|png|svg/;

export const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // only 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return callback(null, true);
    } else {
      callback(null, false);
      req['fileValidationError'] = { error: 'Invalid file type. Only JPEG, JPG, PNG, and SVG are allowed.' };
    }
  },
};
