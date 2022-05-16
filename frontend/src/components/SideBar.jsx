import React, { useEffect } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

function SideBar({ user }) {
  useEffect(() => {
    if (!user || user.twitches.length == 0) {
      removeSideBarContainer();
      return hideSideBar();
    }
    if (user && user.twitches.length > 0) {
      addSideBarContainer();
      return showSideBar();
    }
  }, [user]);

  const toggleSideBar = () => {
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    sidebar.classList.toggle('sidebar-opened');
    main.classList.toggle('main-opened');
  };

  const toggleCollapse = () => {
    let toggleCollapseBtn = document.getElementById('toggleCollapseBtn');
    let toggleOpenBtn = document.getElementById('toggleOpenBtn');
    let toggleMessage = document.getElementById('toggleMessage');
    toggleCollapseBtn.classList.toggle('hidden');
    toggleOpenBtn.classList.toggle('hidden');
    toggleMessage.classList.toggle('hidden');
    toggleSideBar();
  };

  const resetSideBar = () => {
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    let toggleCollapseBtn = document.getElementById('toggleCollapseBtn');
    let toggleOpenBtn = document.getElementById('toggleOpenBtn');
    let toggleMessage = document.getElementById('toggleMessage');
    sidebar.classList.remove('sidebar-opened');
    main.classList.remove('main-opened');
    toggleMessage.classList.add('hidden');
    toggleCollapseBtn.classList.add('hidden');
    toggleOpenBtn.classList.remove('hidden');
  };

  const addSideBarContainer = () => {
    document.getElementById('main').classList.add('main-collapsed');
  };
  const removeSideBarContainer = () => {
    document.getElementById('main').classList.remove('main-collapsed');
  };
  const showSideBar = () => {
    document.getElementById('mySideBar').classList.remove('hidden');
  };
  const hideSideBar = () => {
    resetSideBar();
    document.getElementById('mySideBar').classList.add('hidden');
  };

  return (
    <section className="sidebar-collapsed" id="mySideBar">
      <div className="toggle-collapse-container">
        <div className="toggle-message hidden" id="toggleMessage">
          Followed Channels
        </div>
        <div className="toggle-collapse-btn toggle-btn hidden" id="toggleCollapseBtn">
          <BsArrowBarLeft size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="toggle-open-container">
        <div className="toggle-open-btn toggle-btn" id="toggleOpenBtn">
          <BsArrowBarRight size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <article className="content">
        <ul>
          {user?.twitches.map((twitch) => (
            <li key={twitch._id}>
              <a href="">{twitch.name}</a>
            </li>
          )) || ''}
        </ul>
      </article>
    </section>
  );
}

export default SideBar;
