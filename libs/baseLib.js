export function GotoRoute(url) {
    if (typeof window !== "undefined") {
        console.log('goto ' + url);
        window.location = url;
        return true;
    }
    return false;
}