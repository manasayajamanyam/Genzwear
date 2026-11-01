const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryStatus = {
  configured: Boolean(cloudName && uploadPreset),
  message:
    'Live product images are uploaded securely through an unsigned Cloudinary upload preset.',
}

export async function uploadProductImage(file, onProgress) {
  if (!cloudinaryStatus.configured) {
    throw new Error('Cloudinary is not configured. Add the VITE_CLOUDINARY_* values to .env.local.')
  }
  if (!(file instanceof File)) {
    throw new TypeError('Choose an image file to upload.')
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded.')
  }

  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', uploadPreset)
  data.append('folder', 'genz-wear/products')

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    })
    request.addEventListener('load', () => {
      const response = JSON.parse(request.responseText || '{}')
      if (request.status >= 200 && request.status < 300 && response.secure_url) {
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
        })
      } else {
        reject(new Error(response.error?.message || 'Cloudinary rejected the upload.'))
      }
    })
    request.addEventListener('error', () => reject(new Error('Could not connect to Cloudinary.')))
    request.send(data)
  })
}
