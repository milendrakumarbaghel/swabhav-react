import './App.css';
import Header from './components/Header';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <div className="container">
      <Header />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <ContactForm />
    </div>
  );
}

export default App;
