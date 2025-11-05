class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"],
                    },
                ],
                
                
            });
        }

        

    }

    // CREATE OFFER
    async createOffer() {
        if (!this.peer) {
            throw new Error("Peer connection is not initialized");
        }
        try {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            console.log("Created Offer:", offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    }

    // CREATE ANSWER
    async createAnswer(offer) {
        if (!this.peer) {
            throw new Error("Peer connection is not initialized");
        }
        try {
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription( new RTCSessionDescription(answer));
            console.log("Created Answer:", answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    }


    // SET ANSWER
    async setRemoteAnswer(answer) {
        try {
            console.log("Setting Remote Answer:", answer);
            if (this.peer.signalingState !== "have-local-offer") {
                throw new Error(
                    `Invalid state: ${this.peer.signalingState}. Expected 'have-local-offer'.`
                );
            }
            await this.peer.setRemoteDescription(answer);
            console.log("Remote Answer Set Successfully");
        } catch (error) {
            console.error("Error setting remote answer:", error);
        }
    }




}

// Obj of the class
export default new PeerService();

