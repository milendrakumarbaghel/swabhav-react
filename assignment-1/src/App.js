import employees from './data/employees';
import TeamSection from './components/TeamSection';
import './App.css';

const DEPARTMENTS = ['Engineering', 'Design', 'Product'];

function App() {
  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-header__title">TechNova — Team Directory</h1>
        <p className="app-header__subtitle">
          {employees.length} employees across {DEPARTMENTS.length} departments
        </p>
      </div>

      {DEPARTMENTS.map((dept) => (
        <TeamSection
          key={dept}
          department={dept}
          members={employees.filter((emp) => emp.department === dept)}
        />
      ))}
    </div>
  );
}

export default App;
