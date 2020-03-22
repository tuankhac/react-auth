import React from 'react';
import Api from './Api';
import Intents from './Intents';
import ProjectBot from './ProjectBot';
import Stories from './Stories';
import Training from './Training';
import UserGroup from './UserGroup';
import UserRole from './UserRole';
import Users from './Users';
import UserState from './UserState';
import Actions from './Actions';
import Templates from './Templates';
import RollbackVersion from './RollbackVersion';
import Home from '../common/Home';

const routes = [
    // { path: '/UserGroup', exact: false, main: () => <UserGroup /> },
    // { path: '/UserRole', exact: false, main: () => <UserRole /> },
    // { path: '/UserState', exact: false, main: () => <UserState /> },
    { path: '/', exact: true, main: () => <Home /> },
    // { path: '/Secret', exact: false, main: () => <Api /> },
    // { path: '/Intents', exact: false, main: () => <Intents /> },
    { path: '/Actions', exact: false, main: () => <Actions /> },
    // { path: '/CodeEmbedded', exact: false, main: () => <CodeEmbedded /> },
    // { path: '/Templates', exact: false, main: () => <Templates /> },
    // { path: '/Stories', exact: false, main: () => <Stories /> },
    // { path: '/', exact: true, main: () => <ProjectBot /> },
    // { path: '/Training', exact: false, main: () => <Training /> },
    // { path: '/RollbackVersion', exact: false, main: () => <RollbackVersion /> }
];

export default routes;