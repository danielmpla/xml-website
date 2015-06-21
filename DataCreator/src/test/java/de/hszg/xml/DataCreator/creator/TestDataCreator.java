package de.hszg.xml.DataCreator.creator;

import static org.junit.Assert.*;

import org.junit.Test;

public class TestDataCreator {

	@Test
	public void testGeneration() {
		boolean result = true;
		
		for(int i=0; i<=1000; i++){
			DataCreator creator = new DataCreator();
			double lat = creator.getLatitude();
			double lon = creator.getLongitude();
			if(!(lat>=-90&&lat<=90)) result = false;
			if(!(lon>=-180&&lon<=180)) result = false;
			
		}
		assertEquals(true, result);
	}
	
	@Test
	public void testGenerateNext(){
		fail("not yet implemented");
	}

}
