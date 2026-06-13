import { Firestore } from "@google-cloud/firestore";

let _db: Firestore | null = null;

export function getAdminDb(): Firestore {
  if (!_db) {
    const sa = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8")
    );
    _db = new Firestore({
      projectId: sa.project_id,
      credentials: {
        client_email: sa.client_email,
        private_key: sa.private_key,
      },
      preferRest: true,
    });
  }
  return _db;
}
