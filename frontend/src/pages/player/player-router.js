export function getPlayerVideoId(params) {
    const videoId = params.get('id');
    return videoId?.trim() ?? '';
}
