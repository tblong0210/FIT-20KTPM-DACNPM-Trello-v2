import SidebarTemplate from '../Templates/component/SidebarTemplate';
import CardTemplate from '../Templates/component/CardTemplate';

export function Templates() {
  return (
    <div className="grid grid-cols-4 gap-4 ml-20">
      <div className="sidebar-container">
        <SidebarTemplate />
      </div>
      <div className="card-container col-span-3 mr-20">
        <CardTemplate />
      </div>
    </div>
  );
}
