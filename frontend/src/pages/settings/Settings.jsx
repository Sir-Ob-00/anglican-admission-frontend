import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import { Link } from "react-router-dom";

export default function Settings() {
  const { role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  const adminSettings = [
    {
      title: "Manage Users",
      description: "Create, edit, and manage user accounts and permissions",
      to: "/settings/users",
      icon: "👥"
    },
    {
      title: "Activity Logs", 
      description: "View system activity logs and audit trails",
      to: "/settings/logs",
      icon: "📋"
    },
    {
      title: "System Backup",
      description: "Backup and restore system data",
      to: "/settings/backup", 
      icon: "💾"
    }
  ];

  const headteacherSettings = [
    {
      title: "Users",
      description: "View system users and roles",
      to: "/settings/users",
      icon: "👥"
    },
    {
      title: "Activity Logs",
      description: "View system activity logs",
      to: "/settings/logs", 
      icon: "📋"
    }
  ];

  const settingsOptions = normalizedRole === "admin" ? adminSettings : 
                         normalizedRole === "headteacher" ? headteacherSettings : [];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Settings" 
        subtitle="Configure and manage system settings and preferences" 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsOptions.map((setting, index) => (
          <Link
            key={index}
            to={setting.to}
            className="block group"
          >
            <Panel className="p-6 h-full transition-all duration-200 hover:shadow-lg hover:border-blue-200 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{setting.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {setting.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {setting.description}
                  </p>
                </div>
              </div>
            </Panel>
          </Link>
        ))}
      </div>

      {settingsOptions.length === 0 && (
        <Panel className="p-8 text-center">
          <div className="text-3xl mb-4">⚙️</div>
          <div className="font-display text-lg font-semibold text-slate-900">No Settings Available</div>
          <div className="mt-2 text-sm text-slate-600">
            Your role doesn't have access to system settings.
          </div>
        </Panel>
      )}
    </div>
  );
}
