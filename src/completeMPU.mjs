import { CompleteMultipartUploadCommand, S3Client } from "@aws-sdk/client-s3";


const s3client = new S3Client({
	region: "sa-east-1",
});
const bucket = "multipart-upload-bucket-s3"

export async function handler(event) {
	const { fileKey, uploadId, parts } = JSON.parse(event.body)

	const command = new CompleteMultipartUploadCommand({
		Bucket: bucket,
		Key: fileKey,
		UploadId: uploadId,
		MultipartUpload: {
			Parts: parts.map(part => ({
				PartNumber: part.partNumber,
				ETag: part.entityTag
			}))
		}
	})

	const {} = await s3client.send(command)
}
