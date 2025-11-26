// components/DashboardStats.jsx
import { Link } from 'react-router-dom';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const StatContent = (
          <div className="card p-6 rounded-lg transition transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        );

        return stat.link ? (
          <Link to={stat.link} key={index}>
            {StatContent}
          </Link>
        ) : (
          <div key={index}>{StatContent}</div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
