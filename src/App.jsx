import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main_Page from './Components/Pages/Main_Page';
import Non_Found_Page from './Components/Pages/Non_Found_Page';
import Layout from './Components/Standart/Layout/Layout';
import Analytics from './Components/Pages/Analytics';
import Settings from './Components/Pages/Settings';
import InstallButton from "./Components/Pages/InstallButton/InstallButton";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main_Page />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Non_Found_Page />} />
        </Route>
      </Routes>

      {/* Кнопка установки */}
      <InstallButton />
    </>
  );
}

export default App;
