

export const getRecordings = async (submitter='', submitter_group='', location='', receiver='', calibrated='yes', storm='', object='', freq_type='', start='', stop='', sort_field='submitter', direction='asc', limit=25, offset=0) => {
    let formData = new FormData();
    formData.append('submitter',submitter);
    formData.append('submitter_group',submitter_group);
    formData.append('location',location);
    formData.append('receiver',receiver);
    formData.append('calibrated',calibrated);
    formData.append('storm',storm);
    formData.append('object',object);
    formData.append('freq_type',freq_type);
    formData.append('start',start);
    formData.append('stop',stop);
    formData.append('sort_field',sort_field);
    formData.append('direction',direction);
    formData.append('limit',limit);
    formData.append('offset',offset);
    let response = await fetch('http://radiojove.org/query/query.php', {
        method: 'POST',
        body: formData,
    });
    let resp = await response.json();
    return resp;
}