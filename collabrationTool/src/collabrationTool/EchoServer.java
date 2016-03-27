package collabrationTool;

import java.io.IOException;
import java.util.ArrayList;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
 

@ServerEndpoint("/echo/{room}") 
public class EchoServer {

	
	public static ArrayList<Session> sessions = new ArrayList<Session>();

	 
	  @OnMessage
	  public void messageReceiver(String message) throws ParseException {
	    //System.out.println("Received message:" + message);
	    for (Session session : sessions) {
			try {
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(message);
				if(session.getUserProperties().get("room").equals(json.get("room"))){
				session.getBasicRemote().sendText(message);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	  }

	  @OnOpen
	  public void onOpen(Session session, @PathParam("room") final String room) {
	 //   System.out.println("onOpen: " + session.getId());
		  session.getUserProperties().put("room", room);
	    sessions.add(session);
	 //   System.out.println("onOpen: sessions.size " + sessions.size());
	  }

	  @OnClose
	  public void onClose(Session session) {
	  //  System.out.println("onClose: " + session.getId());
	    sessions.remove(session);
	  }
}
