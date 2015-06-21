package de.hszg.xml.DataCreator;

import java.util.LinkedList;
import java.util.List;

import de.hszg.xml.DataCreator.creator.DataCreator;
import de.hszg.xml.DataCreator.restConnection.RESTClient;

public class LiveDataCreation {
	
	private static String[] macs = {
		"12:34:56:66:66",
		"65:43:21:11:11"
//		"00-80-41-ae-fd-6e",
//		"00-80-41-ae-fd-7e",
//		"00-80-41-ae-fd-8e",
//		"00-80-41-ae-fd-9e"
	};
	
	private static String host = "http://xmlmonit.koding.io:8080/exist/rest";
	
	
    public static void main( String[] args )
    {
        RESTClient client = new RESTClient(host);
        List<DataCreator> creators = new LinkedList<DataCreator>();
        for(int i = 0; i<macs.length;i++){
        	DataCreator creator = new DataCreator(macs[i], 51.140421, 14.962189);
        	creators.add(creator);
        }
        while(true){
        	for (DataCreator dataCreator : creators) {
        		dataCreator.generateNext(5);
        		client.sendCoordinates(dataCreator.getMac(),dataCreator.getLatitude(),dataCreator.getLongitude());
			}
        try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
        }
    }
}
