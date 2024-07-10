import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3client = new S3Client({
	region: "sa-east-1",
});

export async function handler(event) {
	const { fileName, totalChunks } = JSON.parse(event.body);

	const bucket = "multipart-upload-bucket-s3"
	const key = `${randomUUID()}-${fileName}`

	const createMPUCommand = new CreateMultipartUploadCommand({
		Bucket: bucket,
		Key: key,
	});

	const { UploadId } = await s3client.send(createMPUCommand);

	if (!UploadId) {
		return {
			statusCode: 500, body: JSON.stringify({
				message: "Error creating multipart upload",
			}),
		};
	}

	const signedUrlPromises = [];

	for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
		const uploadPartCommand = new UploadPartCommand({
			Bucket: bucket,
			Key: key,
			UploadId,
			PartNumber: partNumber,
		})

		signedUrlPromises.push(getSignedUrl(s3client, uploadPartCommand, {
			expiresIn: 3600,
		}))
	}

	const urls = await Promise.all(signedUrlPromises);

	return {
		statusCode: 201,
		body: JSON.stringify({
			key,
			uploadId: UploadId,
			parts: urls.map((url, index) => ({
				url,
				partNumber: index + 1
			})),
		})
	}
}

