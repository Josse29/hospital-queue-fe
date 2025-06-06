import { useContext, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "./../navigation";
import { FaAngleDown, FaBell, FaFolderPlus } from "react-icons/fa6";
import { Button, ButtonIcon, Container, HeadPage } from "../components";
import {
  BtnRefreshPoliQueue,
  CardPoliQueue,
  ModalPoli,
  ModalCreatePoli,
  SearchPoliQueue,
} from "../features/Poli";
import { AllContext } from "../context/AllProvider";

const QueueRing = () => {
  const { socket, poliQueue, setPoliQueue, getPoliQueue, setLoadingRing } =
    useContext(AllContext);
  const [openPoli, setOpenPoli] = useState(false);
  const [createPoli, setCreatePoli] = useState(false);
  // first updated
  useEffect(() => {
    getPoliQueue();
    socket.on("poli:print", async () => {
      await getPoliQueue();
    });
    return () => socket.off("poli:print");
  }, []);
  // when ring
  const ringTimeOut = useRef(null);
  useEffect(() => {
    socket.on("poliUpdated:ring", async () => {
      clearTimeout(ringTimeOut.current);
      await getPoliQueue();
      ringTimeOut.current = setTimeout(() => {
        setLoadingRing(false);
      }, 1000);
    });
    return () => {
      socket.off("poliUpdated:ring");
      clearTimeout(ringTimeOut.current);
    };
  }, []);
  return (
    <NavigationContainer>
      <HeadPage
        className="border-teal-400"
        icon={<FaBell className="text-3xl" />}
        page="Queue Ring"
      />
      <Container>
        {/* listpoli, createpoli, searchpoli */}
        <div className="flex justify-end gap-3 mb-5">
          {/* refresh */}
          <BtnRefreshPoliQueue setPoliQueue={setPoliQueue} />
          {/* modal poli */}
          <ButtonIcon
            title="List Poli"
            icon={<FaAngleDown />}
            className="bg-sky-600 hover:bg-sky-700 hover:ring-sky-700"
            onClick={() => setOpenPoli(true)}
          />
          {/* create poli */}
          <ButtonIcon
            title="Add Poli"
            icon={<FaFolderPlus className="text-white" />}
            className="bg-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
            onClick={() => setCreatePoli(true)}
          />
          {/* search */}
          <SearchPoliQueue />
        </div>
        {/* card, table, queueRing */}
        {poliQueue.length >= 1 &&
          poliQueue.map((el) => (
            <CardPoliQueue
              key={el._id}
              poliId={el._id}
              poliName={el.PoliName}
              poliQueue={el.PoliQueue}
              poliColor={el.PoliColor}
            />
          ))}
        {poliQueue.length < 1 && (
          <div className="flex h-[300px]">
            <div className="text-3xl text-center font-bold italic m-auto">
              Poli is Empty...
            </div>
          </div>
        )}
      </Container>
      {/* modal poli */}
      <ModalPoli
        getPoliQueue={getPoliQueue}
        openPoli={openPoli}
        setOpenPoli={setOpenPoli}
      />
      <ModalCreatePoli
        getPoliQueue={getPoliQueue}
        createPoli={createPoli}
        setCreatePoli={setCreatePoli}
      />
    </NavigationContainer>
  );
};
export default QueueRing;
