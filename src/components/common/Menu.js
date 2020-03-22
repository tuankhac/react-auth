import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

const menus = [
  { name: 'Trang chủ', to: '/', className: 'fa fa-cogs', exact: true, id: '12', tree: '' },
  // { name: 'Bảo mật', to: '/Secret', className: 'far fa-comment-alt', exact: false, tree: '' },
  { name: 'Actions', to: '/Actions', className: 'fa fa-project-diagram', exact: false, id: '13', tree: '' },
  // { name: 'Stories', to: '/Stories', className: 'fas fa-comments', exact: false, tree: '' },
  { name: 'Tích hợp', to: '/#', className: 'fas fa-layer-group', exact: false, id: 'Intergration', tree: 'childmenu' },
  //   { name: 'Huấn luyện', to: '/Training', className: 'fas fa-graduation-cap', exact: false, tree: '' },
  //   { name: 'Rollback Version', to: '/RollbackVersion', className: 'fas fa-chevron-circle-left', exact: false, tree: '' },
  //   { name: 'Quản lý người dùng', to: '/Users', className: 'fas fa-user-cog', exact: false, tree: '' },
  //   { name: 'Groups', to: '/UserGroup', className: 'fas fa-object-group', exact: false, tree: '' },
  //   { name: 'Roles', to: '/UserRole', className: 'fab fa-critical-role', exact: false, tree: '' }
];

const childMenus = [
  { name: 'APIs', to: '/Api', className: 'fas fa-th-large', exact: false, tree: '', parentNode: 'Intergration' },
  { name: 'Code embedded ', to: '/CodeEmbedded', className: 'fas fa-code', exact: false, tree: '', parentNode: 'Intergration' },
  { name: 'Templates', to: '/Templates', className: 'fas fa-th', exact: false, tree: '', parentNode: 'Intergration' },
  { name: 'Templates 2', to: '/Template', className: 'fas fa-th', exact: false, tree: '', parentNode: '' }
];

// const elementchildmenus = childMenus.map((cchildmenus, index) => {
//   return (
//     <Route key={index} path={cchildmenus.to} exact={cchildmenus.activeWhenExact} children={({ location, match }) => {
//       var active = match ? 'active' : '';
//       return (<li key={index} className={active}>
//         <Link to={cchildmenus.to}><i className={cchildmenus.className}></i>&nbsp;<span>{cchildmenus.name}</span>
//         </Link>
//       </li>)
//     }}></Route>
//   )
// });

var ChildMenuLink = ({ parentNode, onMenuClick }) => {

  let arrMenu = childMenus.filter(e => e.parentNode === parentNode);
  let result = arrMenu.map((item, index) => {
    return (
      <Route key={index} path={item.to} exact={item.activeWhenExact} children={({ match }) => {
        let active = match ? 'active' : '';
        return (<li id={index} level={2} className={active} >
          <Link onClick={onMenuClick} to={item.to}><i className={item.className}></i>&nbsp;<span>{item.name}</span>
          </Link>
        </li>)
      }}></Route>
    )
  });
  return result;
}

const MenuLink = ({ index, label, to, className, activeWhenExact, tree, id, onMenuClick }) => {
  // console.log(activeWhenExact);
  if (tree === 'childmenu') {
    return (
      <li className="treeview" id={`lvl1_${index}`}>
        <a href="#">
          <i className={className}></i> <span>{label}</span>
          <span className="pull-right-container">
            <i className="fas fa-angle-left pull-right" style={{ width: '7px' }}></i>
          </span>
        </a>
        {/* <ul className="treeview-menu" style={{display:'block'}}> */}
        <ul className="treeview-menu">
          <ChildMenuLink parentNode={id} onMenuClick={onMenuClick} />
        </ul>
      </li>
    )
  } else {
    return (
      <Route path={to} exact={activeWhenExact} children={({ match }) => {
        ////console.log(match);
        var active = match ? 'active' : '';
        return (
          <li className={active} level={1} id={`lvl1_${index}`} onClick={onMenuClick}>
            <Link to={to}><i className={className} onClick={onMenuClick} ></i>&nbsp;<span>{label}</span></Link>
          </li>
        )

      }}></Route>
    )
  }
}
var getSiblings = function (elem) {
  // Setup siblings array and get the first sibling
  var sibling = elem.parentNode.firstChild;

  // Loop through each sibling and push to the array
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      sibling.classList.remove("active");
    }
    sibling = sibling.nextSibling
  }
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { curContainerId: "", preContainerId:"" };
  }

  componentDidUpdate() {
    console.log("update");
    if (this.state.curContainerId !== null && this.state.curContainerId !== "") {
      document.getElementById(this.state.curContainerId).classList.add("active");
    }
    if (this.state.preContainerId !== null && this.state.preContainerId !== "" && this.state.preContainerId !== undefined) {
      if(this.state.preContainerId !== this.state.curContainerId){
        document.getElementById(this.state.preContainerId).classList.remove("active");
        document.getElementById(this.state.preContainerId).classList.remove("menu-open");
        let ul = document.getElementById(this.state.preContainerId).querySelector("ul");
        if(ul !== null && ul !== undefined){
          ul.style.display = 'none';
        }
      }
    }
  }

  componentDidMount() {
  }
  render() {
    return (
      <ul className="sidebar-menu tree" data-widget="tree">
        <li className="header">MAIN NAVIGATION</li>
        {this.showMenus(menus)}
      </ul>
    );
  }

  showMenus = (menus) => {
    var result = null;
    if (menus.length > 0) {
      result = menus.map((menu, index) => {
        return (
          <MenuLink key={index}
            index={index}
            label={menu.name}
            to={menu.to}
            className={menu.className}
            activeWhenExact={menu.exact}
            tree={menu.tree}
            id={menu.id}
            onMenuClick={this.onMenuClick}>
          </MenuLink>
        )
      })
    }
    return result;
  }
  onMenuClick = e => {
    let menuId = e.target.offsetParent.getAttribute("id");
    if (menuId !== null) {
      this.setState({ preContainerId: this.state.curContainerId });
      this.setState({ curContainerId: menuId });
      console.log(this.curContainerId);
    } else {
      menuId = e.target.offsetParent.offsetParent.getAttribute("id");
      this.setState({ preContainerId: this.state.curContainerId });
      this.setState({ curContainerId: menuId });
      console.log(this.curContainerId);
    }
  }
}

export default Menu;