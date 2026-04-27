import TopBar from "../TopBar/TopBar";
import MainNavbar from "../MainNavBar/MainNavBar";
import { useNavigate } from "react-router-dom";

const navDepartments = [
  { id: "1", name: "Setups" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Acessórios" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade VR" },
  { id: "8", name: "Áudio" },
];

const Header = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/produtos/search?categoria=${categoryName}`);
  };

  return (
    <header className="sticky top-0 z-40 mb-6 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <TopBar />
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
        <MainNavbar />
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navDepartments.map((dept) => (
            <li key={dept.id}>
              <button
                className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-white hover:text-primary"
                onClick={() => handleCategoryClick(dept.name)}
              >
                {dept.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
