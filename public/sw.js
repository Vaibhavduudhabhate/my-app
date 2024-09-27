
const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    const response = await fetch('api/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BEhRmaZvkSYvZ2bge8_CHfbK874WSXPdfzQj004Sg2tzIFaU9WzRc6XIGKgI5F6w-aDTSb1fwWPYvclwPZ4-NzM")
    })

    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log(e.data.json())
    const title = data.title;
    const message = {
        body: data.body
    }
    self.registration.showNotification(title, message)
})
