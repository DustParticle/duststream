namespace DustStream.Extensions
{
    public static class AppRole
    {
        public const string GlobalAdmin = "GlobalAdmin";
    }

    public static class AuthorizationPolicies
    {
        public const string GlobalAdminRequired = "GlobalAdminRequired";
        public const string ProjectAdminRequired = "ProjectAdminRequired";
    }
}