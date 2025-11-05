import { useRecoilState } from "recoil";
import { accessedChat, userData } from "../../../../atoms/state";

const GroupParticipantsSlider = () => {
    const [currSelectedChat] = useRecoilState(accessedChat);
    const [currUser] = useRecoilState(userData);

    return (
        <div className="flex items-center gap-1 max-w-[70%] overflow-clip">
            {
                [...currSelectedChat?.users || []]
                .sort((i)=>i._id===currSelectedChat?.groupAdmin._id?-1:1)
                ?.map((user, index) => (
                    <p key={user._id} className="text-xs min-w-fit dark:text-gray-300 text-stone-500 ">
                        {
                          currUser._id===user._id? 'You' :  user.fullName.slice(0, 12) + ".."
                        }
                    </p>
                ))
            }
        </div>
    );
}

export default GroupParticipantsSlider;
