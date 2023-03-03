export class UrlAndMedia {
    private static API_BASE_URL = "http://localhost:8080/";
    private static OAUTH2_URL = UrlAndMedia.API_BASE_URL + "oauth2/authorization/";
    private static REDIRECT_URL = "?redirect_uri=http://localhost:4200/home";
    public static API_URL = UrlAndMedia.API_BASE_URL + "api/";
    public static AUTH_API = UrlAndMedia.API_URL + "auth/";
    public static GOOGLE_AUTH_URL = UrlAndMedia.OAUTH2_URL + "google" + UrlAndMedia.REDIRECT_URL;
}
