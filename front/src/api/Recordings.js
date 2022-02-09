

export const uploadRecording = async (formData) => {
    try {
        let response = await fetch(`/recordings/upload`,{
            method: 'POST',
            body: formData
        });
        let resp = await response.json();
        return resp;
    } catch (error) {
        return {"message":"Network or Server Error"}
    }
}

export const uploadSPD = async (file) => {
    let formData = new FormData();
    formData.append('spd',file)
    let response = await fetch(`/upload`,{
        method: 'POST',
        body: formData
    });
    let resp = await response.json();
    return resp;
}

export const getRecording = async (rid) => {
    let response = await fetch(`/recordings/${rid}`,{
        method: 'GET',
    });
    let resp = await response.json();
    return resp;
}